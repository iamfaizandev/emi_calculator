import React from "react";
import { Skeleton } from "@mui/material";

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton variant="text" width="75%" height={24} />
    <Skeleton variant="rectangular" width="100%" height={48} />
    <Skeleton variant="rectangular" width="100%" height={48} />
    <Skeleton variant="rectangular" width="100%" height={48} />
    <Skeleton variant="rectangular" width="100%" height={256} />
  </div>
);

export default LoadingSkeleton;
