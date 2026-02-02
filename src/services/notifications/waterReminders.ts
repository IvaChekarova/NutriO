import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

const WATER_CHANNEL_ID = 'water-reminders';

const clampHour = (value: string, fallback: number) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(parsed, 0), 23);
};

const buildScheduleWindows = (
  startHour: string,
  endHour: string,
  now: Date,
) => {
  const start = clampHour(startHour, 8);
  const end = clampHour(endHour, 20);
  const startDate = new Date(now);
  startDate.setHours(start, 0, 0, 0);
  const endDate = new Date(now);
  endDate.setHours(end, 0, 0, 0);

  if (end <= start) {
    endDate.setDate(endDate.getDate() + 1);
  }

  if (now > endDate) {
    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() + 1);
  } else if (now > startDate) {
    startDate.setTime(now.getTime());
  }

  return { startDate, endDate };
};

export const ensureWaterChannel = async () => {
  await notifee.createChannel({
    id: WATER_CHANNEL_ID,
    name: 'Water reminders',
    importance: AndroidImportance.DEFAULT,
  });
};

export const requestWaterPermission = async () => {
  const settings = await notifee.requestPermission();
  return [
    AuthorizationStatus.AUTHORIZED,
    AuthorizationStatus.PROVISIONAL,
  ].includes(settings.authorizationStatus);
};

export const cancelWaterReminders = async () => {
  if (typeof notifee.cancelAllNotifications === 'function') {
    await notifee.cancelAllNotifications();
  }
  if (typeof notifee.cancelTriggerNotifications === 'function') {
    await notifee.cancelTriggerNotifications();
  }
};

export const scheduleWaterReminders = async (params: {
  totalMl: number;
  goalMl: number;
  intervalMinutes: number | null;
  startHour: string;
  endHour: string;
}) => {
  if (typeof notifee.createTriggerNotification !== 'function') {
    return;
  }
  const { totalMl, goalMl, intervalMinutes, startHour, endHour } = params;
  const effectiveInterval = __DEV__ ? 1 : intervalMinutes;
  if (!effectiveInterval || goalMl <= 0 || totalMl >= goalMl) {
    await cancelWaterReminders();
    return;
  }

  await cancelWaterReminders();
  await ensureWaterChannel();

  const now = new Date();
  const { startDate, endDate } = buildScheduleWindows(startHour, endHour, now);
  const intervalMs = effectiveInterval * 60 * 1000;

  const notifications: Promise<string>[] = [];
  const nowMs = Date.now() + 1000;
  let firstTime = startDate.getTime();
  if (firstTime < nowMs) {
    const diff = nowMs - firstTime;
    const steps = Math.ceil(diff / intervalMs);
    firstTime += steps * intervalMs;
  }

  for (let time = firstTime; time <= endDate.getTime(); time += intervalMs) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: time,
    };

    notifications.push(
      notifee.createTriggerNotification(
        {
          title: 'Time to hydrate',
          body: 'Take a sip and keep your streak going.',
          android: {
            channelId: WATER_CHANNEL_ID,
            pressAction: {
              id: 'default',
            },
          },
        },
        trigger,
      ),
    );
  }

  await Promise.all(notifications);
};
