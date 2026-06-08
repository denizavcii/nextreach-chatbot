import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // E-posta veya telefon yoksa kaydetme
  if (!body.email && !body.phone) {
    return NextResponse.json(
      { error: "İletişim bilgisi gerekli" },
      { status: 400 },
    );
  }

  // Duplicate kontrolü
  let is_duplicate = false;
  if (body.email) {
    const { data: existing } = await supabase
      .from("contact_leads")
      .select("id")
      .eq("email", body.email)
      .limit(1);
    if (existing && existing.length > 0) is_duplicate = true;
  }
  if (!is_duplicate && body.phone) {
    const { data: existing } = await supabase
      .from("contact_leads")
      .select("id")
      .eq("phone", body.phone)
      .limit(1);
    if (existing && existing.length > 0) is_duplicate = true;
  }

  const { error } = await supabase.from("contact_leads").insert([
    {
      name: body.name,
      company: body.company,
      sector: body.sector,
      pain_point: body.pain_point,
      email: body.email,
      phone: body.phone,
      score: body.score,
      full_transcript: body.full_transcript,
      is_duplicate,
      is_read: false,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, is_duplicate });
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

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, is_read } = body;

  const { error } = await supabase
    .from("contact_leads")
    .update({ is_read })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
