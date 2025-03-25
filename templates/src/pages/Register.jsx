const Register = () => {
  return (
    <div>
      <div class="flex items-center justify-center min-h-screen bg-[#f7fafc]">
        <form
          action="{%url 'dang_ky'%}"
          method="post"
          autocomplete="off"
          class="w-[380px] h-[530px] rounded-xs shadow-md rounded bg-[#fff]"
        >
          <h1 class="mt-2 text-xl font-bold text-center">Welcom DNews</h1>
          <ul class="mt-2 ml-3 text-sm text-red-600 bg-red-500">
            <li></li>
          </ul>
          <label
            for="username"
            class="block mt-4 ml-8 text-sm font-bold text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            class="mt-1 w-[300px] px-3 py-2 ml-8 rounded border border-gray-300 !bg-[#f7fafc] shadow-inner rounded-xs"
            required
          />
          <br />
          <label
            for="email"
            class="block mt-3 ml-8 text-sm font-bold text-gray-700"
          >
            Email
          </label>
          <input
            type="text"
            name="email"
            class="mt-1 w-[300px] px-3 py-2 ml-8 rounded border border-gray-300 bg-[#f7fafc] shadow-inner rounded-xs"
            required
          />
          <br />
          <label
            for="password"
            class="block mt-3 ml-8 text-sm font-bold text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            class="mt-1 w-[300px] px-3 py-2 ml-8 rounded border border-gray-300 shadow-inner rounded-xs"
          />
          <br />
          <label
            for="password2"
            class="block mt-3 ml-8 text-sm font-bold text-gray-700"
          >
            Confirm password
          </label>
          <input
            type="password"
            name="password2"
            class="mt-1 w-[300px] px-3 py-2 ml-8 rounded border border-gray-300 shadow-inner rounded-xs"
          />
          <br />

          <button
            type="submit"
            class="justify-center block px-8 py-2 mx-auto mt-6 text-gray-200 bg-blue-600 rounded hover:bg-blue-800"
          >
            Đăng ký
          </button>

          <span class="block mx-auto mt-3 text-center">
            Bạn đã có tài khoản
            <a class="text-blue-700">Đăng nhập</a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
