# multi-color

false color gradients in elements and maps

<details>
	<summary>*contents*</summary>

    - [features](#features)
    - [use](#use)
      -[node](#node)
    	-[browser](#browser)

</details>

## features

- 0 dependencies
- css color inputs
- cylindrical interpolation
- linear Ok Lab space
- gamma corrected mapping

## use

### node

```sh
npm i multi-color
```

```jsx
export function Background() {
	return (
		<multi-color nw={'#f0f'} sw={'#ff0'} se={'0f0'} ne={'#0ff'}></multi-color>
	)
}
```

### browser

```html
<head>
	<script src="https://cdn.jsdelivr.net/npm/multi-color"></script>
</head>

<body>
	<multi-color nw="#0ff" ne="#f0f" sw="f0f" se="00f"> </multi-color>
</body>
```
