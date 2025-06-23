import { Webhook } from 'standardwebhooks'
import { headers } from 'next/headers'
import { dodopayments } from '@/lib/dodopayments'
import { NextResponse } from 'next/server'
// import
const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY!)

export async function POST(request: Request) {
  const headersList = headers()

  try {
    const rawBody = await request.text()
    const webhookHeaders = {
      'webhook-id': (await headersList).get('webhook-id') || '',
      'webhook-signature': (await headersList).get('webhook-signature') || '',
      'webhook-timestamp': (await headersList).get('webhook-timestamp') || '',
    }
    await webhook.verify(rawBody, webhookHeaders)
    const payload = JSON.parse(rawBody)

    if (payload.data.payment_type === 'Subscription') {
      switch (payload.type) {
        case 'subscription.active':
          const subscription = await dodopayments.subscriptions.retrieve(
            payload.data.subscription_id
          )
          console.log('-------SUBSCRIPTION DATA START ---------')
          console.log(subscription)
          console.log('-------SUBSCRIPTION DATA END ---------')
          break
        case 'subscription.failed':
          console.log('-------SUBSCRIPTION FAILED ---------')
          break
        case 'subscription.cancelled':
          console.log('-------SUBSCRIPTION CANCELLED ---------')
          break
        case 'subscription.renewed':
          console.log('-------SUBSCRIPTION RENEWED ---------')
          break
        case 'subscription.on_hold':
          console.log('-------SUBSCRIPTION ON HOLD ---------')
        default:
          break
      }
    } else if (payload.data.payload_type === 'Payment') {
      switch (payload.type) {
        case 'payment.succeeded':
          const paymentDataResp = await dodopayments.payments.retrieve(
            payload.data.payment_id
          )
          console.log('-------PAYMENT DATA START ---------')
          console.log(paymentDataResp)
          console.log('-------PAYMENT DATA END ---------')
          break
        default:
          break
      }
    }

    return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
