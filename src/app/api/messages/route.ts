import { NextResponse } from 'next/server';
import { getMessages, addMessage, deleteMessage, getSiteConfig } from '@/lib/data-store';

export async function GET(request: Request) {
  const currentConfig = getSiteConfig();
  const providedPass = request.headers.get('x-admin-pass');
  const expectedPass = process.env.ADMIN_PASSWORD || currentConfig.adminPassword || 'admin';

  if (providedPass !== expectedPass) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const messages = getMessages();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const saved = addMessage({
      name: name?.trim() || 'Anonymous Visitor',
      contact: contact?.trim() || 'Not provided',
      message: message.trim()
    });

    return NextResponse.json({ success: true, message: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save message', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const currentConfig = getSiteConfig();
    const providedPass = request.headers.get('x-admin-pass');
    const expectedPass = process.env.ADMIN_PASSWORD || currentConfig.adminPassword || 'admin';

    if (providedPass !== expectedPass) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    deleteMessage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message', details: String(error) }, { status: 500 });
  }
}
