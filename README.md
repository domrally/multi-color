# multi-color

visually balanced gradients

## features

- gamma corrected sRGB display mapping
- cyclindrical Ok Lab interpolation space
- css input supported by colorjs.io
- dual css gradient fallback
- minified by default

## use

### css

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
npm i @domrally/multi-color
```

```jsx
export default function () {
	return <multi-color></multi-color>
}
```

### browser

```html
<!DOCTYPE html>

<html>
	<head>
		<meta charset="utf-8" />
		<script type="module">
			import 'https://cdn.jsdelivr.net/npm/@domrally/multi-color/index.js'
		</script>
	</head>

	<body>
		<style>
			multi-color {
				--background-top-left-color: #0ff;
				--background-top-right-color: #000;
				--background-bottom-right-color: #00a;
				--background-bottom-left-color: #f0f;
			}
		</style>
		<multi-color></multi-color>
	</body>
</html>
```
