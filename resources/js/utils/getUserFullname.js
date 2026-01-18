export function getUserFullname(user){
    return `${user.first_name} ${user.middle_initial ? `${user.middle_initial.toUpperCase()}.` : ""} ${user.last_name}`
}