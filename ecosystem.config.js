module.exports = {
  apps: [{
    name: 'dofusdb-recipes',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '256M',
    env: {
      NODE_ENV: 'production'
    },
    // Reinicio programado a las 4:00 AM (libera memoria)
    cron_restart: '0 4 * * *',
    // Logs
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    merge_logs: true
  }]
};
