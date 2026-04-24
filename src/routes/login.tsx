import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function LoginRoute() {
  const navigate = useNavigate();
  return (
    <div className="rounded-md border border-ink/10 bg-white p-6 shadow-card">
      <div className="mb-6 text-2xl font-bold">
        courtside<span className="text-primary">.</span>
      </div>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/');
        }}
      >
        <input
          className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
        />
        <input
          className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}
