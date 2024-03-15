# tailwind

- 플러그인 : Tailwind CSS IntelliSense
- https://tailwindcss.com/

## 1. html 버전

- https://tailwindcss.com/docs/installation/play-cdn
- /public/tailwind.html 생성(수업 후 삭제)
- <script src="https://cdn.tailwindcss.com"></script>
- tailwind 에는 기본적으로 reset.css 가 이미 적용 됨

### 1.숫자단위 : https://tailwindcss.com/docs/width

: w-1 width: 0.25rem; /_ 4px _/
: w-1/2 width: 50%;

```html
<div class="space-y-4 m-10 bg-red-400 w-1/2 h-10">
  <div class="w-96 bg-white shadow rounded">w-96</div>
  <div class="w-80 bg-white shadow rounded">w-80</div>
  <div class="w-72 bg-white shadow rounded">w-72</div>
  <div class="w-64 bg-white shadow rounded">w-64</div>
  <div class="w-60 bg-white shadow rounded">w-60</div>
  <div class="w-56 bg-white shadow rounded">w-56</div>
  <div class="w-52 bg-white shadow rounded">w-52</div>
  <div class="w-48 bg-white shadow rounded">w-48</div>
</div>
```

### 2. color : https://tailwindcss.com/docs/text-color

```html
<div class="w-10 h-10 bg-blue-500"></div>
<div class="w-10 h-10 bg-red-500"></div>
<div class="grid grid-cols-10 gap-2">
  <div class="bg-indigo-50 aspect-square"></div>
  <div class="bg-indigo-100 aspect-square"></div>
  <div class="bg-indigo-200 aspect-square"></div>
  <div class="bg-indigo-300 aspect-square"></div>
</div>
```

### 3. Typography

: https://tailwindcss.com/docs/font-family
: https://tailwindcss.com/docs/font-size

```txt
  text-xs font-size: 0.75rem; /_ 12px _/
  line-height: 1rem; /_ 16px _/
  text-sm font-size: 0.875rem; /_ 14px _/
  line-height: 1.25rem; /_ 20px _/
  text-base font-size: 1rem; /_ 16px _/
  line-height: 1.5rem; /_ 24px _/
  text-lg font-size: 1.125rem; /_ 18px _/
  line-height: 1.75rem; /_ 28px _/
  text-xl font-size: 1.25rem; /_ 20px _/
  line-height: 1.75rem; /_ 28px _/
  text-2xl font-size: 1.5rem; /_ 24px _/
  line-height: 2rem; /_ 32px _/
  text-3xl font-size: 1.875rem; /_ 30px _/
  line-height: 2.25rem; /_ 36px _/
  text-4xl font-size: 2.25rem; /_ 36px _/
  line-height: 2.5rem; /_ 40px _/
  text-5xl font-size: 3rem; /_ 48px _/
  line-height: 1;
  text-6xl font-size: 3.75rem; /_ 60px _/
  line-height: 1;
  text-7xl font-size: 4.5rem; /_ 72px _/
  line-height: 1;
  text-8xl font-size: 6rem; /_ 96px _/
  line-height: 1;
  text-9xl font-size: 8rem; /_ 128px _/
  line-height: 1;
```

```html
<div class="p-3 bg-blue-400 shadow rounded-lg">
  <h3 class="text-xs border-b-1">font-sans</h3>
  <p class="font-sans">Lorem ipsum dolor sit amet.</p>
</div>
```

### 4. Shadow : https://tailwindcss.com/docs/box-shadow

### 5. Basic Property

margin: https://tailwindcss.com/docs/margin
padding: https://tailwindcss.com/docs/padding
fontweight: https://tailwindcss.com/docs/font-weight
textcolor: https://tailwindcss.com/docs/text-color

### 6. Flex

: https://tailwindcss.com/docs/flex

```html
<div class="flex border-4 border-red-300 m-3">
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
</div>
```

```html
<div class="flex border-4 border-red-300 m-3">
  <div class="p-2 border-4 border-blue-500">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit,
    laudantium sed. Autem dignissimos, veritatis optio soluta quos illum, unde
    numquam quia voluptatem suscipit, ratione sed sequi maxime cupiditate
    possimus accusantium.
  </div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
</div>
```

- flex-col

```html
<div class="flex flex-col border-4 border-red-300 m-3">
  <div class="p-2 border-4 border-blue-500">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit,
    laudantium sed. Autem dignissimos, veritatis optio soluta quos illum, unde
    numquam quia voluptatem suscipit, ratione sed sequi maxime cupiditate
    possimus accusantium.
  </div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
</div>
```

- flex-wrap

```html
<div class="flex flex-wrap border-4 border-red-300 m-3">
  <div class="p-2 border-4 border-blue-500">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit,
    laudantium sed. Autem dignissimos, veritatis optio soluta quos illum, unde
    numquam quia voluptatem suscipit, ratione sed sequi maxime cupiditate
    possimus accusantium.
  </div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
</div>
```

- gap-6

```html
<div class="flex flex-wrap gap-6 border-4 border-red-300 m-3">
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
</div>
```

- justify-between

```html
<div class="flex justify-between border-4 border-red-300 m-3">
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
</div>
```

- justify-center

```html
<div class="flex justify-center border-4 border-red-300 m-3">
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
</div>
```

- items-center

```html
<div
  class="flex justify-center items-center border-4 border-red-300 m-3 w-80 h-80"
>
  <div class="p-2 border-4 border-blue-500">Hello World</div>
</div>
```

- flex 와 반응형 작업
  : flex md:flex-row flex-col order-배치순서

```html
<div class="flex md:flex-row flex-col border-4 border-red-300 m-3">
  <div class="flex-1 order-2 p-2 border-4 border-blue-500">1번 홍길동</div>
  <div class="flex-1 order-3 p-2 border-4 border-blue-500">2번 둘리</div>
  <div class="flex-1 order-4 p-2 border-4 border-blue-500">3번 강백호</div>
  <div class="flex-1 order-1 p-2 border-4 border-blue-500">4번 김민수</div>
</div>
```

### 7. 리액트 프로젝트에 Tailwind 적용하기

- tw 폴더 만들고 프로젝트 생성
- `npx create-react-app ./`
- https://tailwindcss.com/docs/installation
