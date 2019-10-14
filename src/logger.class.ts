export default function Logger(
  level: 'success' | 'default' | 'info' | 'warning' | 'error' = 'default',
  loggerName: string
) {
  let name = loggerName;
  let emoji = '';
  let messageStyle = '';
  let nameStyle = '';
  switch (level) {
    case 'success':
      messageStyle += 'color: #27ae60';
      emoji = '✅ ';
      break;
    case 'info':
      messageStyle += 'color: #3498db';
      emoji = 'ℹ️ ';
      break;
    case 'warning':
      messageStyle += 'color: #f39c12';
      emoji = '🚸 ';
      break;
    case 'error':
      messageStyle += 'color: #e74c3c';
      emoji = '⛔ ';
      break;
  }
  nameStyle = `font-weight: bold;${messageStyle}`;
  return (message: string) => {
    if (!window.enabledLoggers.includes(name) && !window.enabledLoggers.includes('*')) return;
    console.log('%s%c%s: %c%s', emoji, nameStyle, name, messageStyle, message);
  };
}
