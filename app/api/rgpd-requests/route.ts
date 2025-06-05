// app/api/rgpd-requests/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger'; // Assuming your Pino logger
import { AppError } from '@/error/AppError'; // Assuming AppError is in this path

export const dynamic = 'force-dynamic';

// Define Zod schema for the POST request body
const rgpdRequestSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  user_name: z.string().min(1, { message: "User name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  request_type: z.enum(['access', 'deletion', 'rectification'], { message: "Invalid request type" }),
  status: z.enum(['pending', 'processing', 'completed', 'rejected']).default('pending'),
  message: z.string().optional(),
});

// Helper for standardized error responses
function createErrorResponse(message: string, status: number, code?: string, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details: process.env.NODE_ENV === 'development' ? details : undefined
      }
    },
    { status }
  );
}

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data, error: supabaseError } = await supabase
      .from('rgpd_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (supabaseError) {
      // Throw an AppError or a specific error to be caught by the catch block
      throw new AppError(`Supabase GET error: ${supabaseError.message}`, 'SUPABASE_GET_ERROR', supabaseError);
    }

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error: any) {
    logger.error({ err: error, context: 'GET /api/rgpd-requests' }, error.message || 'Failed to fetch RGPD requests');
    if (error instanceof AppError) {
      return createErrorResponse(error.message, 500, error.code, error.details);
    }
    return createErrorResponse('An unexpected error occurred while fetching RGPD requests.', 500, 'UNEXPECTED_ERROR');
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const body = await request.json();
    const validationResult = rgpdRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const errorDetails = validationResult.error.flatten();
      logger.warn({ errors: errorDetails, context: 'POST /api/rgpd-requests validation' }, 'RGPD request validation failed');
      return createErrorResponse('Invalid request body.', 400, 'VALIDATION_ERROR', errorDetails);
    }

    const validatedData = validationResult.data;

    const { data, error: supabaseError } = await supabase
      .from('rgpd_requests')
      .insert({
        user_id: validatedData.user_id,
        user_name: validatedData.user_name,
        email: validatedData.email,
        request_type: validatedData.request_type,
        status: validatedData.status,
        message: validatedData.message,
      })
      .select()
      .single();

    if (supabaseError) {
      // Example: Map a specific PostgreSQL error code (unique violation) to a 409 Conflict
      if (supabaseError.code === '23505') { // Unique violation
         throw new AppError('A similar RGPD request already exists or there is a conflict.', 'RGPD_CONFLICT', supabaseError);
      }
      throw new AppError(`Supabase POST error: ${supabaseError.message}`, 'SUPABASE_POST_ERROR', supabaseError);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });

  } catch (error: any) {
    logger.error({ err: error, context: 'POST /api/rgpd-requests' }, error.message || 'Failed to create RGPD request');

    if (error instanceof AppError) {
      const statusCode = error.code === 'RGPD_CONFLICT' ? 409 : 500;
      return createErrorResponse(error.message, statusCode, error.code, error.details);
    }
    if (error.name === 'SyntaxError') { // From request.json() if body is not valid JSON
        return createErrorResponse('Invalid JSON format in request body.', 400, 'INVALID_JSON');
    }
    return createErrorResponse('An unexpected error occurred while creating the RGPD request.', 500, 'UNEXPECTED_POST_ERROR');
  }
}
