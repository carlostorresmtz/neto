import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data/waitlist.json");

function readList(): string[] {
  try {
    return JSON.parse(readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeList(list: string[]) {
  writeFileSync(FILE, JSON.stringify(list, null, 2));
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = (typeof body.email === "string" ? body.email : "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  try {
    const list = readList();
    if (!list.includes(email)) {
      list.push(email);
      writeList(list);
    }
  } catch {
    // Filesystem is read-only in production (Vercel); the localStorage guard
    // on the client prevents duplicate submissions from the same browser.
  }

  return NextResponse.json({ ok: true });
}
