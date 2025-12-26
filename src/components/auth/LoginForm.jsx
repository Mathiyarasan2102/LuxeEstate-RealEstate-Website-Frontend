import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../store/usersApiSlice';
import { setCredentials } from '../../store/authSlice';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import GoogleLoginButton from '../GoogleLoginButton';
import { Eye, EyeOff } from 'lucide-react';
import { AuthSkeleton } from '../ui/Skeletons';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [login, { isLoading, error }] = useLoginMutation();
    const { user } = useSelector((state) => state.auth);

    const [searchParams] = useSearchParams();
    const from = searchParams.get('redirect') || location.state?.from?.pathname || '/';

    const isSeller = searchParams.get('isSeller') === 'true';

    useEffect(() => {
        if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
            console.error('CRITICAL: VITE_GOOGLE_CLIENT_ID is not defined in import.meta.env. Google Sign-In will not work.');
        }
    }, []);

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                navigate(from, { replace: true });
            }
        }
    }, [navigate, user, from]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({
                user: {
                    _id: res._id,
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    avatar: res.avatar,
                    authProviders: res.authProviders
                },
                token: res.token
            }));
            if (res.role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return <AuthSkeleton />;
    }

    return (
        <div className="w-full max-w-md bg-navy-800 p-8 rounded-lg shadow-xl border border-navy-700">
            <h1 className="text-3xl font-serif text-center text-gold-400 mb-6">
                {isSeller ? 'Agent Login' : 'Welcome Back'}
            </h1>
            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center">{error?.data?.message || error.error}</div>}
            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="input-field mt-1"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Password</label>
                    <div className="relative mt-1">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            autoComplete="current-password"
                            className="input-field pr-10"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gold-400 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary"
                >
                    {isLoading ? 'Loading...' : 'Sign In'}
                </button>
            </form>

            {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-navy-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-navy-800 text-gray-400">Or continue with</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <GoogleLoginButton />
                    </div>
                </div>
            )}

            <p className="mt-8 text-center text-sm text-gray-400">
                {isSeller ? 'New Agent?' : 'New Customer?'} <Link to={`/register${isSeller ? '?isSeller=true' : ''}`} className="text-gold-400 hover:text-gold-500">Register</Link>
            </p>
        </div>
    );
};

export default LoginForm;
