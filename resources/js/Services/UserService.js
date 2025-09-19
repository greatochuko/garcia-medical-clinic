import { router } from '@inertiajs/react';

class UserService {
    createUser(userData) {
        return router.post(route('users.store'), userData, {
            onSuccess: () => {
                // Handle success (e.g., show notification)
            },
            onError: (errors) => {
                // Handle errors
                return errors;
            },
            preserveScroll: true,
        });
    }

    updateUser(id, userData) {
        return router.put(route('users.update', id), userData, {
            onSuccess: () => {
                // Handle success
            },
            onError: (errors) => {
                // Handle errors
                return errors;
            },
            preserveScroll: true,
        });
    }

    deleteUser(id) {
        return router.delete(route('users.destroy', id), {
            onSuccess: () => {
                // Handle success
            },
            onError: (errors) => {
                // Handle errors
                return errors;
            },
        });
    }
}

export default new UserService(); 