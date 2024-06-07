import { useEffect, useState } from 'react';

const requireAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const [isAuth, setIsAuth] = useState(false);
        useEffect(() => {
            const isAdmin = localStorage.getItem('isAdmin');
            if (!isAdmin) {
            window.location.href = '/auth';
            } else {
                setIsAuth(true);
            }
        }, []);

        if (!isAuth) return <main></main>;
        return <WrappedComponent {...props} />;
    };
};

export default requireAuth;
