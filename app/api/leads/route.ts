import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { error } = await supabase.from("contact_leads").insert([
    {
      name: body.name,
      company: body.company,
      pain_point: body.pain_point,
      email: body.email,
      score: body.score,
      full_transcript: body.full_transcript,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const { data, error } = await supabase
    .from("contact_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
