# multi-color

visually balanced gradients

## features

- gamma corrected sRGB display mapping
- cyclindrical Ok Lab interpolation space
- css input supported by colorjs.io
- dual css gradient fallback

## use

```css
multi-color {
	--background-top-left-color: #0ff;
	--background-top-right-color: #f0f;
	--background-bottom-left-color: #f0f;
	--background-bottom-right-color: #00f;
}
```

### node

```sh
npm i multi-color
```

```jsx
export default function () {
	return <multi-color></multi-color>
}
```

### browser

```html
<html>
	<head>
		<script src="https://cdn.jsdelivr.net/npm/multi-color"></script>
	</head>

	<body>
		<multi-color></multi-color>
	</body>
</html>
```
