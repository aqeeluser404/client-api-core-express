// import Queue from 'bull'
// import { sendEmail } from '../../src/services/emailService.js'

// const emailQueue = new Queue('email-queue')

// emailQueue.process(async (job) => {
//   const { to, subject, body } = job.data
//   await sendEmail(to, subject, body)
// })

// export function initEmailQueue() {
//   console.log('Email queue is running...')
// } 