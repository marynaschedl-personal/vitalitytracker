import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';
import { query, initializeDatabase } from './db-neon.js';

// Load environment variables FIRST
config();

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

// Global request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    auth: req.headers.authorization ? req.headers.authorization.substring(0, 30) + '...' : 'none',
    body: req.body
  });
  next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Email Templates (Outlook-compatible)
function getWelcomeEmailTemplate(name, email) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-collapse: collapse;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #667eea; color: white; padding: 30px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Welcome to VitalityTracker! 🎉</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 30px 20px; background-color: #ffffff; color: #333;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">Hi ${name || 'there'},</p>
                    <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">Thanks for signing up! You're all set to start tracking your health and fitness journey.</p>

                    <!-- Feature 1 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-left: 4px solid #667eea;">
                      <tr>
                        <td style="padding: 15px; background-color: #fafafa;">
                          <p style="margin: 0 0 8px 0; font-size: 18px;">📊 <strong>Track Daily Nutrition</strong></p>
                          <p style="margin: 0; font-size: 14px; color: #666;">Log your calorie intake and monitor your protein consumption.</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Feature 2 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-left: 4px solid #667eea;">
                      <tr>
                        <td style="padding: 15px; background-color: #fafafa;">
                          <p style="margin: 0 0 8px 0; font-size: 18px;">👟 <strong>Monitor Your Steps</strong></p>
                          <p style="margin: 0; font-size: 14px; color: #666;">Set daily step goals and watch your progress in real-time.</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Feature 3 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-left: 4px solid #667eea;">
                      <tr>
                        <td style="padding: 15px; background-color: #fafafa;">
                          <p style="margin: 0 0 8px 0; font-size: 18px;">📈 <strong>Track Body Measurements</strong></p>
                          <p style="margin: 0; font-size: 14px; color: #666;">Record and visualize your progress with detailed body metrics.</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 30px 0 20px 0; font-size: 16px; line-height: 1.6;">Ready to get started? Log in and create your first daily report!</p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; font-size: 16px;">Go to VitalityTracker</a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 30px 0 0 0; font-size: 14px; color: #999;">Questions? We're here to help. Just reply to this email.</p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px; background-color: #f9f9f9; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999;">
                    <p style="margin: 0;">© 2026 VitalityTracker. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function getResetPasswordEmailTemplate(resetLink) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-collapse: collapse;">
                <!-- Header -->
                <tr>
                  <td align="center" style="background-color: #667eea; color: white; padding: 30px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Reset Your Password</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 30px 20px; background-color: #ffffff; color: #333;">
                    <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">We received a request to reset your VitalityTracker password.</p>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <a href="${resetLink}" style="display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; font-weight: bold; font-size: 16px;">Reset Password</a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 20px 0 10px 0; text-align: center; font-size: 14px; color: #666;">Or copy this link:</p>
                    <p style="margin: 0 0 25px 0; text-align: center; word-break: break-all; color: #667eea; font-size: 12px;"><a href="${resetLink}" style="color: #667eea; text-decoration: none;">${resetLink}</a></p>

                    <!-- Alert Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-left: 4px solid #ffc107; background-color: #fffbf0;">
                      <tr>
                        <td style="padding: 15px;">
                          <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">⏱️ This link expires in 1 hour</p>
                          <p style="margin: 0; font-size: 14px; color: #666;">If you didn't request a password reset, you can safely ignore this email.</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 30px 0 0 0; font-size: 14px; color: #666;">Questions? Contact our support team.</p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding: 20px; background-color: #f9f9f9; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999;">
                    <p style="margin: 0;">© 2026 VitalityTracker. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
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
  console.log('[verifyToken] Called for', req.method, req.path);
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('[verifyToken] NO TOKEN FOUND');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    console.log('[verifyToken] Token found, verifying...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[verifyToken] Token valid, userId:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log('[verifyToken] Token invalid:', error.message);
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
    console.log('GET daily-reports - returning', result.rows.length, 'reports');
    if (result.rows.length > 0) {
      console.log('Latest report:', result.rows[0]);
    }
    res.json(result.rows);
  } catch (error) {
    console.error('Get daily reports error:', error);
    res.status(500).json({ error: 'Failed to get daily reports' });
  }
});

app.post('/api/daily-reports', verifyToken, async (req, res) => {
  console.log('=== POST /api/daily-reports START ===');
  console.log('Headers:', req.headers.authorization ? 'Bearer token present' : 'NO TOKEN');
  console.log('req.userId:', req.userId);
  console.log('req.body:', req.body);

  try {
    const { date, steps, calories_consumed, protein_consumed, exercises_done, meals_count, submitted } = req.body;
    console.log('Parsed fields:', { date, steps, calories_consumed, protein_consumed, exercises_done, meals_count, submitted });

    console.log('Checking if report exists for', { userId: req.userId, date });
    // Check if report already exists for this date
    const existing = await query(
      'SELECT * FROM daily_reports WHERE user_id = $1 AND date = $2',
      [req.userId, date]
    );

    console.log('Query result - existing reports:', existing.rows.length);

    if (existing.rows.length > 0) {
      // Update existing instead of creating
      console.log('Report exists, updating...');
      const result = await query(
        `UPDATE daily_reports SET steps = $1, calories_consumed = $2, protein_consumed = $3, exercises_done = $4, meals_count = $5, submitted = $6 WHERE user_id = $7 AND date = $8 RETURNING *`,
        [steps || 0, calories_consumed || 0, protein_consumed || 0, exercises_done || 0, meals_count || 0, submitted || false, req.userId, date]
      );
      console.log('Updated report:', result.rows[0]);
      console.log('=== POST /api/daily-reports END (UPDATE) ===');
      return res.json(result.rows[0]);
    }

    console.log('Creating new report...');
    const result = await query(
      'INSERT INTO daily_reports (user_id, date, steps, calories_consumed, protein_consumed, exercises_done, meals_count, submitted, calories_goal, steps_goal, exercises_goal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1766, 7000, 3) RETURNING *',
      [req.userId, date, steps || 0, calories_consumed || 0, protein_consumed || 0, exercises_done || 0, meals_count || 0, submitted || false]
    );
    console.log('Created report:', result.rows[0]);
    console.log('=== POST /api/daily-reports END (CREATE) ===');

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('=== POST /api/daily-reports ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to create daily report' });
  }
});

app.put('/api/daily-reports/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, steps, calories_consumed, protein_consumed, exercises_done, meals_count, submitted } = req.body;
    console.log('PUT daily-reports/:id', { id, userId: req.userId, calories_consumed, protein_consumed, meals_count });

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (date !== undefined) {
      updates.push(`date = $${paramIndex++}`);
      values.push(date);
    }
    if (steps !== undefined) {
      updates.push(`steps = $${paramIndex++}`);
      values.push(steps);
    }
    if (calories_consumed !== undefined) {
      updates.push(`calories_consumed = $${paramIndex++}`);
      values.push(calories_consumed);
    }
    if (protein_consumed !== undefined) {
      updates.push(`protein_consumed = $${paramIndex++}`);
      values.push(protein_consumed);
    }
    if (exercises_done !== undefined) {
      updates.push(`exercises_done = $${paramIndex++}`);
      values.push(exercises_done);
    }
    if (meals_count !== undefined) {
      updates.push(`meals_count = $${paramIndex++}`);
      values.push(meals_count);
    }
    if (submitted !== undefined) {
      updates.push(`submitted = $${paramIndex++}`);
      values.push(submitted);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    values.push(req.userId);

    const result = await query(
      `UPDATE daily_reports SET ${updates.join(', ')} WHERE id = $${paramIndex++} AND user_id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Daily report not found' });
    }

    console.log('Updated report:', result.rows[0]);
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

// ============ FEEDBACK ENDPOINT ============

app.post('/api/feedback', async (req, res) => {
  try {
    const { message, rating } = req.body;
    const userId = req.headers.authorization ?
      (() => {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, JWT_SECRET);
          return decoded.userId;
        } catch {
          return null;
        }
      })() : null;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await query(
      'INSERT INTO feedback (user_id, message, rating) VALUES ($1, $2, $3) RETURNING id, created_at',
      [userId, message.trim(), rating || null]
    );

    res.status(201).json({
      id: result.rows[0].id,
      message: 'Thank you for your feedback!'
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3001;

async function start() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });

  // Handle errors
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
