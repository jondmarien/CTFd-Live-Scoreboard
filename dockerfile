# Use official lightweight NGINX image
FROM nginx:1.25-alpine

# Set working directory
WORKDIR /app

# Copy all project files
COPY index.html .
COPY assets/ /app/assets/

# Ensure CSS files have correct permissions
RUN chmod -R 755 /app

# Copy NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
