import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    
          let computedClassName = className;

    if (className !== 'list-nav') {
        computedClassName =
            'inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
            (active ? 'nav-item-active ' : 'nav-item ') +
            className;
    }

    return (
        <Link {...props} className={computedClassName}>
            {children}
        </Link>
    );
}
