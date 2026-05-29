export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden mesh-bg">
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl animate-float" />
      <div
        className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl animate-float"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl animate-float"
        style={{ animationDelay: '4s' }}
      />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
    </div>
  );
}
