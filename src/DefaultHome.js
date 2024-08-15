import { Link } from 'react-router-dom';

function DefaultHome() {
    return (
        <div>
            <p>Hello. Homepage.</p>
            <div>
                <Link to="/admin">Admin Panel</Link>
            </div>
        </div>
    );
}

export default DefaultHome;