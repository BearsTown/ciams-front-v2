<template>
  <div class="customPagination">
    <button type="button" class="btn-arrow">
      <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.94884 7.65782C3.83635 7.77031 3.65397 7.77031 3.54148 7.65782L0.0849612 4.2013C-0.027527 4.08881 -0.027527 3.90643 0.0849613 3.79394L3.54148 0.337423C3.65397 0.224935 3.83635 0.224935 3.94884 0.337423C4.06133 0.449911 4.06133 0.63229 3.94884 0.744778L0.695994 3.99762L3.94884 7.25047C4.06133 7.36295 4.06133 7.54533 3.94884 7.65782Z"
          fill="#757575"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M6.54063 7.65782C6.42815 7.77031 6.24577 7.77031 6.13328 7.65782L2.67676 4.2013C2.56427 4.08881 2.56427 3.90643 2.67676 3.79394L6.13328 0.337423C6.24577 0.224935 6.42815 0.224935 6.54063 0.337423C6.65312 0.449911 6.65312 0.63229 6.54063 0.744778L3.28779 3.99762L6.54063 7.25047C6.65312 7.36295 6.65312 7.54533 6.54063 7.65782Z"
          fill="#757575"
        />
      </svg>
    </button>
    <button type="button" class="btn-arrow">
      <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.94688 7.65782C4.8344 7.77031 4.65202 7.77031 4.53953 7.65782L1.08301 4.2013C0.970519 4.08881 0.970519 3.90643 1.08301 3.79394L4.53953 0.337423C4.65202 0.224935 4.8344 0.224935 4.94688 0.337423C5.05937 0.449911 5.05937 0.63229 4.94688 0.744778L1.69404 3.99762L4.94688 7.25047C5.05937 7.36295 5.05937 7.54533 4.94688 7.65782Z"
          fill="#757575"
        />
      </svg>
    </button>
    <div class="num-wrap">
      <button type="button" class="btn-num active">1</button>
      <button type="button" class="btn-num">2</button>
      <button type="button" class="btn-num">3</button>
      <button type="button" class="btn-num">4</button>
      <button type="button" class="btn-num">5</button>
      <button type="button" class="btn-num">6</button>
      <button type="button" class="btn-num">7</button>
    </div>
    <button type="button" class="btn-arrow">
      <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1.05312 0.342178C1.1656 0.229691 1.34798 0.229691 1.46047 0.342179L4.91699 3.7987C5.02948 3.91119 5.02948 4.09357 4.91699 4.20606L1.46047 7.66258C1.34798 7.77507 1.1656 7.77506 1.05311 7.66258C0.940627 7.55009 0.940627 7.36771 1.05311 7.25522L4.30596 4.00238L1.05312 0.749533C0.940628 0.637045 0.940628 0.454666 1.05312 0.342178Z"
          fill="#757575"
        />
      </svg>
    </button>
    <button type="button" class="btn-arrow">
      <svg width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3.05116 0.342178C3.16365 0.229691 3.34603 0.229691 3.45852 0.342179L6.91504 3.7987C7.02753 3.91119 7.02753 4.09357 6.91504 4.20606L3.45852 7.66258C3.34603 7.77507 3.16365 7.77506 3.05116 7.66258C2.93867 7.55009 2.93867 7.36771 3.05116 7.25522L6.30401 4.00238L3.05116 0.749533C2.93867 0.637045 2.93867 0.454666 3.05116 0.342178Z"
          fill="#757575"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.459366 0.342178C0.571854 0.229691 0.754233 0.229691 0.866721 0.342179L4.32324 3.7987C4.43573 3.91119 4.43573 4.09357 4.32324 4.20606L0.86672 7.66258C0.754232 7.77507 0.571853 7.77506 0.459365 7.66258C0.346877 7.55009 0.346877 7.36771 0.459365 7.25522L3.71221 4.00238L0.459366 0.749533C0.346878 0.637045 0.346878 0.454666 0.459366 0.342178Z"
          fill="#757575"
        />
      </svg>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'CustomPagination',
  }
</script>
