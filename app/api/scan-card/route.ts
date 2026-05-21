import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { image } = await req.json()
    if (!image) {
      return NextResponse.json({ error: 'الصورة مطلوبة' }, { status: 400 })
    }

    const matches = image.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json({ error: 'صيغة الصورة غير صالحة' }, { status: 400 })
    }
    const [, mediaType, base64Data] = matches

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(mediaType)) {
      return NextResponse.json({ error: 'نوع الصورة غير مدعوم' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `هذه صورة بطاقة أعمال. استخرج المعلومات التالية بدقة وأرجعها كـ JSON فقط بدون أي نص إضافي:
{
  "name": "الاسم الكامل للشخص أو null",
  "title": "المسمى الوظيفي أو null",
  "company": "اسم الشركة أو null",
  "phone": "رقم الهاتف أو null",
  "email": "البريد الإلكتروني أو null",
  "website": "الموقع الإلكتروني أو null"
}
إذا لم تجد قيمة لأي حقل، ضع null. لا ترسل أي نص خارج الـ JSON.`,
            },
          ],
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      return NextResponse.json({ error: 'لم يتمكن الذكاء الاصطناعي من قراءة البطاقة' }, { status: 500 })
    }

    let extracted
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('لا يوجد JSON')
      extracted = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ error: 'فشل تحليل نتيجة الذكاء الاصطناعي' }, { status: 500 })
    }

    // احفظ في جدول الكروت الممسوحة
    await supabase.from('contacts').insert({
      user_id: user.id,
      ...extracted,
    }).select()

    return NextResponse.json(extracted)
  } catch (err: any) {
    console.error('scan-card error:', err)
    return NextResponse.json(
      { error: err.message || 'حدث خطأ غير متوقع' },
      { status: 500 }
    )
  }
}
