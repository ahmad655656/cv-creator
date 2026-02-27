import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

/* =========================
   DELETE CV
========================= */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const cvId = parseInt(id);

    if (isNaN(cvId)) {
      return NextResponse.json({ error: "Invalid CV ID" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cvs = await sql`
      SELECT user_id FROM cvs WHERE id = ${cvId}
    `;

    if (cvs.length === 0) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    if (parseInt(session.user.id) !== cvs[0].user_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await sql`
      DELETE FROM cvs WHERE id = ${cvId}
    `;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting CV:", error);
    return NextResponse.json(
      { error: "Failed to delete CV" },
      { status: 500 }
    );
  }
}

/* =========================
   PATCH CV
========================= */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const cvId = parseInt(id);

    if (isNaN(cvId)) {
      return NextResponse.json({ error: "Invalid CV ID" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, published } = body;

    const cvs = await sql`
      SELECT user_id FROM cvs WHERE id = ${cvId}
    `;

    if (cvs.length === 0) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    if (parseInt(session.user.id) !== cvs[0].user_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // تحديث ديناميكي آمن
    await sql`
      UPDATE cvs
      SET
        title = COALESCE(${title ?? null}, title),
        content = COALESCE(${content ? JSON.stringify(content) : null}, content),
        is_published = COALESCE(${published ?? null}, is_published),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${cvId}
    `;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating CV:", error);
    return NextResponse.json(
      { error: "Failed to update CV" },
      { status: 500 }
    );
  }
}