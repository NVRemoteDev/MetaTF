<h1>Team Fortress 2 Schema</h1>
<% if (results.length) { %>
  <ul>
    <% for (var i = 0; i < results.length; i++) { %>
      <li>Item name: <%= results[i].name %> - <%= results[i].item_slot %> - <img src=<% results[i].image_url_large %> /></li>
      <% if (i % 5 === 0) { %>
      <br />
      <% } %>
    <% } %>
  </ul>
<% } else { %>
  <p>No results</p>
<% } %>