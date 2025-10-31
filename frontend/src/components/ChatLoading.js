const ChatLoading = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="h-[45px] bg-gray-300 rounded animate-pulse"
        ></div>
      ))}
    </div>
  );
};

export default ChatLoading;
