# multi-color

false color gradients

## features

- linear Ok Lab space
- gamma corrected mapping
- css color inputs using colorjs.io
- cylindrical interpolation

## use

```css
multi-color {
	--nw: #0ff;
	--ne: #f0f;
	--sw: #f0f;
	--se: #00f;
}
```

### node

```sh
npm i multi-color
```

```jsx
export function Background() {
	return <multi-color></multi-color>
}
```

### browser

```html
<head>
	<script src="https://cdn.jsdelivr.net/npm/multi-color"></script>
</head>

<body>
	<multi-color></multi-color>
</body>
```
