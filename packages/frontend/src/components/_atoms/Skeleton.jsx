const Skeleton = () => (
  <div role="status" className="w-full animate-pulse">
    <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
    <span className="sr-only">Loading...</span>
  </div>
);
export default Skeleton;
