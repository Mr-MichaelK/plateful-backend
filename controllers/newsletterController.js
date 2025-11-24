import nodemailer from "nodemailer";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // 1️⃣ Check if email already exists
    const existing = await req.db.collection("newsletter").findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "This email is already subscribed." });
    }

    // 2️⃣ Save email to MongoDB
    await req.db.collection("newsletter").insertOne({ email, date: new Date() });

    // 3️⃣ Send welcome email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Recipe App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to our Newsletter!",
      text: "Thank you for subscribing to our recipe newsletter!",
      html: "<p>Thank you for subscribing to our recipe newsletter!</p>",
    });

    res.json({ message: "Subscribed successfully! Check your email." });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    res.status(500).json({ error: "Subscription failed" });
  }
};
