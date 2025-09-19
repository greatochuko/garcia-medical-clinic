<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <title>Laravel + React</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
</head>
<body>
    <div id="react-root"></div>
</body>
</html>
