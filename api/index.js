import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { query } from './db-neon.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Email Templates
function getWelcomeEmailTemplate(name, email) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 32px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .feature { margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #667eea; border-radius: 4px; }
          .feature-icon { font-size: 24px; margin-right: 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to VitalityTracker! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${name || 'there'},</p>
            <p>Thanks for signing up! You're all set to start tracking your health and fitness journey.</p>

            <div class="feature">
              <span class="feature-icon">📊</span>
              <strong>Track Daily Nutrition</strong>
              <p>Log your calorie intake and monitor your protein consumption.</p>
            </div>

            <div class="feature">
              <span class="feature-icon">👟</span>
              <strong>Monitor Your Steps</strong>
              <p>Set daily step goals and watch your progress in real-time.</p>
            </div>

            <div class="feature">
              <span class="feature-icon">📈</span>
              <strong>Track Body Measurements</strong>
              <p>Record and visualize your progress with detailed body metrics.</p>
            </div>

            <p style="margin-top: 30px;">Ready to get started? Log in and create your first daily report!</p>

            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}" class="button">Go to VitalityTracker</a>
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">Questions? We're here to help. Just reply to this email.</p>
          </div>
          <div class="footer">
            <p>© 2026 VitalityTracker. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getResetPasswordEmailTemplate(resetLink) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your VitalityTracker password.</p>

            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>

            <p style="text-align: center; color: #666; font-size: 12px;">Or copy this link:</p>
            <p style="text-align: center; word-break: break-all; color: #667eea; font-size: 12px;">${resetLink}</p>

            <div class="alert">
              <strong>⏱️ This link expires in 1 hour</strong>
              <p style="margin: 10px 0 0 0;">If you didn't request a password reset, you can safely ignore this email.</p>
            </div>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">Questions? Contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2026 VitalityTracker. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// ============ AUTH ENDPOINTS ============

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      'INSERT INTO users (email, password, name, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, name',
      [email, hashedPassword, name || email.split('@')[0]]
    );

    const user = result.rows[0];

    // Send welcome email
    try {
      await resend.emails.send({
        from: 'noreply@contact.vitalitytracker.fit',
        to: email,
        subject: 'Welcome to VitalityTracker! 🎉',
        html: getWelcomeEmailTemplate(user.name, email)
      });
    } catch (emailError) {
      console.warn('Welcome email sending failed (non-blocking):', emailError);
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await query(
      'SELECT id, email, name, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user (but don't reveal if email exists)
    const userResult = await query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );

    // Always return 200 to avoid email enumeration
    if (userResult.rows.length === 0) {
      return res.json({ message: 'If email exists, a reset link will be sent' });
    }

    const user = userResult.rows[0];
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token
    await query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    // Send email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    try {
      await resend.emails.send({
        from: 'noreply@contact.vitalitytracker.fit',
        to: email,
        subject: 'Reset Your VitalityTracker Password',
        html: getResetPasswordEmailTemplate(resetLink)
      });
    } catch (emailError) {
      console.warn('Email sending failed (non-blocking):', emailError);
      // Continue anyway - token is saved in DB
    }

    res.json({ message: 'If email exists, a reset link will be sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process reset request' });
  }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and password required' });
    }

    // Find and validate token
    const tokenResult = await query(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND used = false AND expires_at > NOW()',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const resetToken = tokenResult.rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, resetToken.user_id]
    );

    // Mark token as used
    await query(
      'UPDATE password_reset_tokens SET used = true WHERE id = $1',
      [resetToken.id]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ MEASUREMENTS ENDPOINTS ============

app.get('/api/measurements', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM measurements WHERE user_id = $1 ORDER BY date DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get measurements error:', error);
    res.status(500).json({ error: 'Failed to get measurements' });
  }
});

app.post('/api/measurements', verifyToken, async (req, res) => {
  try {
    const { type, value, unit, date, goal_value } = req.body;

    const result = await query(
      'INSERT INTO measurements (user_id, type, value, unit, date, goal_value) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.userId, type, value, unit, date, goal_value || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create measurement error:', error);
    res.status(500).json({ error: 'Failed to create measurement' });
  }
});

app.put('/api/measurements/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value, unit, date, goal_value } = req.body;

    const result = await query(
      'UPDATE measurements SET type = $1, value = $2, unit = $3, date = $4, goal_value = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
      [type, value, unit, date, goal_value || null, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Measurement not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update measurement error:', error);
    res.status(500).json({ error: 'Failed to update measurement' });
  }
});

// ============ DAILY REPORTS ENDPOINTS ============

app.get('/api/daily-reports', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM daily_reports WHERE user_id = $1 ORDER BY date DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get daily reports error:', error);
    res.status(500).json({ error: 'Failed to get daily reports' });
  }
});

app.post('/api/daily-reports', verifyToken, async (req, res) => {
  try {
    const { date, steps, calories_consumed, protein_consumed, exercises_done, meals_count, submitted } = req.body;

    const result = await query(
      'INSERT INTO daily_reports (user_id, date, steps, calories_consumed, protein_consumed, exercises_done, meals_count, submitted, calories_goal, steps_goal, exercises_goal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1766, 7000, 3) RETURNING *',
      [req.userId, date, steps || 0, calories_consumed || 0, protein_consumed || 0, exercises_done || 0, meals_count || 0, submitted || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create daily report error:', error);
    res.status(500).json({ error: 'Failed to create daily report' });
  }
});

app.put('/api/daily-reports/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, steps, calories_consumed, protein_consumed, exercises_done, meals_count, submitted } = req.body;

    const result = await query(
      'UPDATE daily_reports SET date = $1, steps = $2, calories_consumed = $3, protein_consumed = $4, exercises_done = $5, meals_count = $6, submitted = $7 WHERE id = $8 AND user_id = $9 RETURNING *',
      [date, steps, calories_consumed, protein_consumed, exercises_done, meals_count, submitted, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Daily report not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update daily report error:', error);
    res.status(500).json({ error: 'Failed to update daily report' });
  }
});

// ============ FOODS ENDPOINT ============

app.get('/api/foods', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM foods ORDER BY category, name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({ error: 'Failed to get foods' });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
