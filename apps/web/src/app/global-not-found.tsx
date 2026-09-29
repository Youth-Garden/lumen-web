import { NextIntlClientProvider } from 'next-intl';
import messages from '@/shared/i18n/messages/en.json';
import { NotFoundView } from '@/shared/components/not-found-view';

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider locale="en" messages={messages}>
          <NotFoundView />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
