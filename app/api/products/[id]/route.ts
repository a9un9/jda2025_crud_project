import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = params;
  const body = await req.json();
  const updated = await prisma.product.update({
    where: { id },
    data: { name: body.name, price: parseFloat(body.price) },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: any) {
  const { id } = params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
