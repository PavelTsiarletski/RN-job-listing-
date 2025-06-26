import { useState, useEffect } from 'react';
import { fetchHomeData } from './api';
import { HomeData } from './types';

export function useHomeData() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return { data, loading };
} 