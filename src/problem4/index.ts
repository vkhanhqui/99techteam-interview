// Time complexity: O(n)
// Space complexity: O(1)
function sum_to_n_a(n: number): number {
  let res = 0;
  for (let i = 1; i <= n; i++) {
    res += i;
  }
  return res;
}

// Time complexity: O(n)
// Space complexity: O(n)
function sum_to_n_b(n: number): number {
  if (n <= 1) {
    return n;
  }
  return n + sum_to_n_b(n - 1);
}

// Time complexity: O(1)
// Space complexity: O(1)
function sum_to_n_c(n: number): number {
  return (n * n) / 2 + n / 2;
}
