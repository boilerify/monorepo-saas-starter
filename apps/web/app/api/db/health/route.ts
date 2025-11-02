import { NextResponse } from 'next/server';
import { db } from '@repo/db';

export async function GET() {
    try {
        // Simple connectivity check
        await db.$queryRaw`SELECT 1`;
        return NextResponse.json({ ok: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}