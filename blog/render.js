(function () {
  function getPosts() {
    return Array.isArray(window.blogPosts)
      ? [...window.blogPosts].sort(function (left, right) {
          return new Date(right.published) - new Date(left.published);
        })
      : [];
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function buildTopicLine(post) {
    return [post.category, post.topic].filter(Boolean).map(escapeHtml).join(' / ');
  }

  function buildPostHref(post, basePath) {
    return basePath + 'posts/' + encodeURIComponent(post.slug) + '.html';
  }

  function buildCard(post, basePath) {
    var chips = [
      post.featured ? '<span class="blog-chip featured">Featured Essay</span>' : '',
      post.format ? '<span class="blog-chip">' + escapeHtml(post.format) + '</span>' : '',
      post.readTime ? '<span class="blog-chip">' + escapeHtml(post.readTime) + '</span>' : ''
    ]
      .filter(Boolean)
      .join('');

    return (
      '<article class="blog-card">' +
      '<div class="blog-card-meta">' +
      chips +
      '</div>' +
      '<h3 class="blog-card-title">' +
      escapeHtml(post.title) +
      '</h3>' +
      '<p class="blog-card-summary">' +
      escapeHtml(post.summary) +
      '</p>' +
      '<div class="blog-card-footer">' +
      '<div class="blog-card-details">' +
      '<div class="blog-card-date">' +
      escapeHtml(post.displayDate || post.published) +
      '</div>' +
      '<div class="blog-card-topic">' +
      buildTopicLine(post) +
      '</div>' +
      '</div>' +
      '<a class="blog-card-link" href="' +
      buildPostHref(post, basePath) +
      '">Read Post <i class="fa-solid fa-arrow-right"></i></a>' +
      '</div>' +
      '</article>'
    );
  }

  function renderFeed(options) {
    var target = document.getElementById(options.targetId);
    if (!target) {
      return;
    }

    var posts = getPosts();
    var count = typeof options.count === 'number' ? options.count : posts.length;
    var visiblePosts = count === Infinity ? posts : posts.slice(0, count);

    if (!visiblePosts.length) {
      target.innerHTML =
        '<article class="blog-empty">' +
        (options.emptyMessage || 'No posts published yet.') +
        '</article>';
      return;
    }

    target.innerHTML = visiblePosts
      .map(function (post) {
        return buildCard(post, options.basePath || './');
      })
      .join('');
  }

  function renderCount(targetId) {
    var target = document.getElementById(targetId);
    if (!target) {
      return;
    }
    target.textContent = String(getPosts().length);
  }

  window.blogRenderer = {
    getPosts: getPosts,
    renderCount: renderCount,
    renderFeed: renderFeed
  };
})();
