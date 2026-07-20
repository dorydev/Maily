PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mail_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  label TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT,
  status TEXT NOT NULL,
  last_connection_test_at TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, provider, from_email)
);
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,

  name TEXT NOT NULL,
  subject TEXT NOT NULL,

  body_text TEXT,
  body_html TEXT,

  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN (
      'draft',
      'ready',
      'running',
      'paused',
      'completed',
      'cancelled'
    )
  ),

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at TEXT,
  finished_at TEXT
);

CREATE TABLE IF NOT EXISTS recipients (
  id TEXT PRIMARY KEY,

  campaign_id TEXT NOT NULL,

  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  variables_json TEXT NOT NULL DEFAULT '{}',

  status TEXT NOT NULL DEFAULT 'imported' CHECK (
    status IN (
      'imported',
      'queued',
      'sent',
      'failed',
      'skipped'
    )
  ),

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (campaign_id)
    REFERENCES campaigns(id)
    ON DELETE CASCADE,

  UNIQUE (campaign_id, email)
);

CREATE TABLE IF NOT EXISTS email_jobs (
  id TEXT PRIMARY KEY,

  campaign_id TEXT NOT NULL,
  recipient_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  recipient_email_snapshot TEXT NOT NULL,
  subject_snapshot TEXT NOT NULL,
  body_text_snapshot TEXT,
  body_html_snapshot TEXT,

  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN (
      'pending',
      'sending',
      'sent',
      'failed',
      'cancelled'
    )
  ),

  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,

  last_error TEXT,

  scheduled_at TEXT,
  locked_at TEXT,
  started_at TEXT,
  sent_at TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (campaign_id)
    REFERENCES campaigns(id)
    ON DELETE CASCADE,

  FOREIGN KEY (recipient_id)
    REFERENCES recipients(id)
    ON DELETE CASCADE,

  FOREIGN KEY (account_id)
    REFERENCES mail_accounts(id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS send_logs (
  id TEXT PRIMARY KEY,

  job_id TEXT NOT NULL,

  level TEXT NOT NULL CHECK (
    level IN ('info', 'warning', 'error')
  ),

  message TEXT NOT NULL,

  details_json TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (job_id)
    REFERENCES email_jobs(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS suppression_list (
  id TEXT PRIMARY KEY,

  email TEXT NOT NULL UNIQUE,
  reason TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status
  ON campaigns(status);

CREATE INDEX IF NOT EXISTS idx_recipients_campaign_id
  ON recipients(campaign_id);

CREATE INDEX IF NOT EXISTS idx_email_jobs_status
  ON email_jobs(status);

CREATE INDEX IF NOT EXISTS idx_email_jobs_campaign_id
  ON email_jobs(campaign_id);

CREATE INDEX IF NOT EXISTS idx_email_jobs_scheduled_at
  ON email_jobs(scheduled_at);

CREATE INDEX IF NOT EXISTS idx_send_logs_job_id
  ON send_logs(job_id);

CREATE INDEX IF NOT EXISTS idx_suppression_list_email
  ON suppression_list(email);

-- Providers configuration tables

CREATE TABLE IF NOT EXISTS oauth_account_configs (
  account_id TEXT PRIMARY KEY,

  provider_user_id TEXT,
  scopes TEXT NOT NULL,
  token_secret_ref TEXT NOT NULL,

  access_token_expires_at TEXT,

  FOREIGN KEY (account_id)
    REFERENCES mail_accounts(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS smtp_account_configs (
  account_id TEXT PRIMARY KEY,

  host TEXT NOT NULL,
  port INTEGER NOT NULL,
  secure INTEGER NOT NULL CHECK (secure IN (0, 1)),
  username TEXT NOT NULL,

  auth_type TEXT NOT NULL CHECK (
    auth_type IN ('password', 'app_password', 'oauth2')
  ),

  secret_ref TEXT NOT NULL,

  FOREIGN KEY (account_id)
    REFERENCES mail_accounts(id)
    ON DELETE CASCADE
);
