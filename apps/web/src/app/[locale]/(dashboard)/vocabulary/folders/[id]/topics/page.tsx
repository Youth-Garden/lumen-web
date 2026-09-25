'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';

export default function TopicsFallbackPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : '';

  useEffect(() => {
    if (id) {
      router.replace(formatUrl(RouteEnum.FOLDER_DETAIL, { id }));
    } else {
      router.replace(RouteEnum.VOCABULARY);
    }
  }, [id, router]);

  return null;
}
