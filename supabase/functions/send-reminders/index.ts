import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const resendKey = Deno.env.get('RESEND_API_KEY')!;

  const sb = createClient(supabaseUrl, supabaseKey);

  const { data: configRows } = await sb.from('gramhub_config').select('*');
  const config = Object.fromEntries((configRows || []).map((r: any) => [r.key, r.value]));

  const toEmail = config['notification_email'];
  const tz = config['timezone'] || 'UTC';

  if (!toEmail) {
    return new Response('no notification_email configured', { status: 200 });
  }

  const now = new Date();
  const localDate = new Date(now.toLocaleString('en-US', { timeZone: tz }));
  const dayName = DAYS[localDate.getDay()];
  const hhmm = `${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;

  const { data: reminders } = await sb
    .from('gramhub_reminders')
    .select('*')
    .eq('active', true);

  const matching = (reminders || []).filter((r: any) =>
    Array.isArray(r.days) && r.days.includes(dayName) && r.time === hhmm
  );

  if (!matching.length) {
    return new Response('no reminders to send', { status: 200 });
  }

  const results = await Promise.all(matching.map(async (r: any) => {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Gram Hub <reminders@resend.dev>',
        to: toEmail,
        subject: `📸 Reminder: ${r.label}`,
        html: `<p>Time to post! Your Gram Hub reminder:</p><h2>${r.label}</h2><p>Scheduled for ${hhmm} on ${dayName}</p>`,
      }),
    });
    return res.ok ? 'sent' : `failed: ${await res.text()}`;
  }));

  return new Response(JSON.stringify({ sent: matching.length, results }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
