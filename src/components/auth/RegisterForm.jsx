import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../../store/usersApiSlice';
import { setCredentials } from '../../store/authSlice';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import GoogleLoginButton from '../GoogleLoginButton';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthSkeleton } from '../ui/Skeletons';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [register, { isLoading, error }] = useRegisterMutation();
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
            navigate(from, { replace: true });
        }
    }, [navigate, user, from]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const userData = {
                name,
                email,
                password,
                role: isSeller ? 'agent' : 'user'
            };
            const res = await register(userData).unwrap();
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
            toast.success("Registration successful! Welcome to LuxeEstate.");
            navigate(isSeller ? '/seller/dashboard' : from, { replace: true });
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return <AuthSkeleton isRegister={true} />;
    }

    return (
        <div className="w-full max-w-md bg-navy-800 p-8 rounded-lg shadow-xl border border-navy-700">
            <h1 className="text-3xl font-serif text-center text-gold-400 mb-6">
                {isSeller ? 'Become a LuxeEstate Agent' : 'Create Account'}
            </h1>
            {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center">{error?.data?.message || error.error}</div>}
            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        className="input-field mt-1"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                            autoComplete="new-password"
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
                <div>
                    <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                    <div className="relative mt-1">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            autoComplete="new-password"
                            className="input-field pr-10"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gold-400 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary"
                >
                    {isLoading ? 'Loading...' : 'Sign Up'}
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
                Already have an account? <Link to={`/login${isSeller ? '?isSeller=true' : ''}`} className="text-gold-400 hover:text-gold-500">Sign In</Link>
            </p>
        </div>
    );
};

export default RegisterForm;
