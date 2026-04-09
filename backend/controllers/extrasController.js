const { getQuery, getSingle, runQuery } = require('../config/database');

// @desc    Get student extras (resources and announcements)
// @route   GET /api/extras/student
// @access  Private (Student)
const getStudentExtras = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get student resources
    const resourcesQuery = `
      SELECT id, title, description, icon, category, access, url, isActive, createdAt
      FROM student_resources
      WHERE isActive = 1
      ORDER BY title ASC
    `;
    
    const resources = await getQuery(resourcesQuery);
    
    // Get student announcements
    const announcementsQuery = `
      SELECT id, title, description, date, priority, isActive, createdAt
      FROM student_announcements
      WHERE isActive = 1
      ORDER BY 
        CASE 
          WHEN priority = 'high' THEN 1
          WHEN priority = 'medium' THEN 2
          WHEN priority = 'low' THEN 3
          ELSE 4
        END,
        date DESC
    `;
    
    const announcements = await getQuery(announcementsQuery);
    
    // Calculate statistics
    const stats = {
      resources: resources.length,
      announcements: announcements.length,
      services: resources.filter(r => r.category === 'Services').length
    };
    
    // Format resources for frontend
    const formattedResources = resources.map(resource => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      icon: resource.icon,
      category: resource.category,
      access: resource.access,
      url: resource.url
    }));
    
    // Format announcements for frontend
    const formattedAnnouncements = announcements.map(announcement => ({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      date: announcement.date,
      priority: announcement.priority
    }));
    
    res.json({
      success: true,
      resources: formattedResources,
      announcements: formattedAnnouncements,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lecturer extras (resources and announcements)
// @route   GET /api/extras/lecturer
// @access  Private (Lecturer)
const getLecturerExtras = async (req, res) => {
  try {
    const lecturerId = req.user.id;
    
    // Get lecturer resources
    const resourcesQuery = `
      SELECT id, title, description, icon, category, items, url, isActive, createdAt
      FROM lecturer_resources
      WHERE isActive = 1
      ORDER BY title ASC
    `;
    
    const resources = await getQuery(resourcesQuery);
    
    // Get lecturer announcements
    const announcementsQuery = `
      SELECT id, title, description, date, priority, isActive, createdAt
      FROM lecturer_announcements
      WHERE isActive = 1
      ORDER BY 
        CASE 
          WHEN priority = 'high' THEN 1
          WHEN priority = 'medium' THEN 2
          WHEN priority = 'low' THEN 3
          ELSE 4
        END,
        date DESC
    `;
    
    const announcements = await getQuery(announcementsQuery);
    
    // Calculate statistics
    const stats = {
      resources: resources.length,
      announcements: announcements.length,
      tools: resources.reduce((sum, r) => sum + (r.items || 0), 0)
    };
    
    // Format resources for frontend
    const formattedResources = resources.map(resource => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      icon: resource.icon,
      category: resource.category,
      items: resource.items,
      url: resource.url
    }));
    
    // Format announcements for frontend
    const formattedAnnouncements = announcements.map(announcement => ({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      date: announcement.date,
      priority: announcement.priority
    }));
    
    res.json({
      success: true,
      resources: formattedResources,
      announcements: formattedAnnouncements,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all student resources (for admin management)
// @route   GET /api/extras/student-resources
// @access  Private (Admin)
const getStudentResources = async (req, res) => {
  try {
    const resourcesQuery = `
      SELECT id, title, description, icon, category, access, url, isActive, createdAt, updatedAt
      FROM student_resources
      ORDER BY title ASC
    `;
    
    const resources = await getQuery(resourcesQuery);
    
    res.json({
      success: true,
      resources
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create student resource
// @route   POST /api/extras/student-resources
// @access  Private (Admin)
const createStudentResource = async (req, res) => {
  try {
    const { title, description, icon, category, access, url } = req.body;
    
    // Create resource
    const insertQuery = `
      INSERT INTO student_resources (title, description, icon, category, access, url, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    
    await runQuery(insertQuery, [title, description, icon, category, access, url]);
    
    // Get the created resource
    const newResourceQuery = `
      SELECT id, title, description, icon, category, access, url, isActive, createdAt
      FROM student_resources
      WHERE id = last_insert_rowid()
    `;
    
    const newResource = await getSingle(newResourceQuery);
    
    res.status(201).json({
      success: true,
      resource: newResource
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student resource
// @route   PUT /api/extras/student-resources/:id
// @access  Private (Admin)
const updateStudentResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const { title, description, icon, category, access, url, isActive } = req.body;
    
    // Update resource
    const updateQuery = `
      UPDATE student_resources
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          icon = COALESCE(?, icon),
          category = COALESCE(?, category),
          access = COALESCE(?, access),
          url = COALESCE(?, url),
          isActive = COALESCE(?, isActive),
          updatedAt = datetime('now')
      WHERE id = ?
    `;
    
    await runQuery(updateQuery, [title, description, icon, category, access, url, isActive, resourceId]);
    
    // Get updated resource
    const updatedResourceQuery = `
      SELECT id, title, description, icon, category, access, url, isActive, createdAt, updatedAt
      FROM student_resources
      WHERE id = ?
    `;
    
    const updatedResource = await getSingle(updatedResourceQuery, [resourceId]);
    
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json({
      success: true,
      resource: updatedResource
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student resource
// @route   DELETE /api/extras/student-resources/:id
// @access  Private (Admin)
const deleteStudentResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    
    // Soft delete by setting isActive to false
    await runQuery('UPDATE student_resources SET isActive = 0, updatedAt = datetime(\'now\') WHERE id = ?', [resourceId]);
    
    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all lecturer resources (for admin management)
// @route   GET /api/extras/lecturer-resources
// @access  Private (Admin)
const getLecturerResources = async (req, res) => {
  try {
    const resourcesQuery = `
      SELECT id, title, description, icon, category, items, url, isActive, createdAt, updatedAt
      FROM lecturer_resources
      ORDER BY title ASC
    `;
    
    const resources = await getQuery(resourcesQuery);
    
    res.json({
      success: true,
      resources
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create lecturer resource
// @route   POST /api/extras/lecturer-resources
// @access  Private (Admin)
const createLecturerResource = async (req, res) => {
  try {
    const { title, description, icon, category, items, url } = req.body;
    
    // Create resource
    const insertQuery = `
      INSERT INTO lecturer_resources (title, description, icon, category, items, url, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    
    await runQuery(insertQuery, [title, description, icon, category, items, url]);
    
    // Get the created resource
    const newResourceQuery = `
      SELECT id, title, description, icon, category, items, url, isActive, createdAt
      FROM lecturer_resources
      WHERE id = last_insert_rowid()
    `;
    
    const newResource = await getSingle(newResourceQuery);
    
    res.status(201).json({
      success: true,
      resource: newResource
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update lecturer resource
// @route   PUT /api/extras/lecturer-resources/:id
// @access  Private (Admin)
const updateLecturerResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    const { title, description, icon, category, items, url, isActive } = req.body;
    
    // Update resource
    const updateQuery = `
      UPDATE lecturer_resources
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          icon = COALESCE(?, icon),
          category = COALESCE(?, category),
          items = COALESCE(?, items),
          url = COALESCE(?, url),
          isActive = COALESCE(?, isActive),
          updatedAt = datetime('now')
      WHERE id = ?
    `;
    
    await runQuery(updateQuery, [title, description, icon, category, items, url, isActive, resourceId]);
    
    // Get updated resource
    const updatedResourceQuery = `
      SELECT id, title, description, icon, category, items, url, isActive, createdAt, updatedAt
      FROM lecturer_resources
      WHERE id = ?
    `;
    
    const updatedResource = await getSingle(updatedResourceQuery, [resourceId]);
    
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json({
      success: true,
      resource: updatedResource
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lecturer resource
// @route   DELETE /api/extras/lecturer-resources/:id
// @access  Private (Admin)
const deleteLecturerResource = async (req, res) => {
  try {
    const resourceId = req.params.id;
    
    // Soft delete by setting isActive to false
    await runQuery('UPDATE lecturer_resources SET isActive = 0, updatedAt = datetime(\'now\') WHERE id = ?', [resourceId]);
    
    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentExtras,
  getLecturerExtras,
  getStudentResources,
  createStudentResource,
  updateStudentResource,
  deleteStudentResource,
  getLecturerResources,
  createLecturerResource,
  updateLecturerResource,
  deleteLecturerResource
};
