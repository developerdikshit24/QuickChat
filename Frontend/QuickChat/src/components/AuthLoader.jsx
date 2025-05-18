import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '../store/authSlice.js';
import { useEffect, useState } from 'react';
import ScreenLoader from './ScreenLoader.jsx';
const AuthLoader = ({ children }) => {
    const user = useSelector(state => state.auth.success);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await dispatch(checkAuth()).unwrap();
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [user]);

    if (loading) {
        return <ScreenLoader />
    }

    return children;
};

export default AuthLoader;
