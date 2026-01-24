
export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name');
  const company = formData.get('company');
  const email = formData.get('email');
  const message = formData.get('message');

  if (!email || !message) {
    return new Response(JSON.stringify({ ok: false, error: 'Email and message are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Logic to handle the inquiry (e.g., email service, database) would go here.
  // For now, we simulate a successful submission.
  console.log('Inquiry received:', { name, company, email, message });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
