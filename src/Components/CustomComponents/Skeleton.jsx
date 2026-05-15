import React from 'react';
import { Skeleton } from 'antd';

const LoadSkeleton = () => {
  return <Skeleton active loading rows={15} />;
};

export default LoadSkeleton;
