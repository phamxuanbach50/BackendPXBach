const ThoiGianGio = require("../../model/ThoiGianGio");

// [POST] /api/thoi-gian-gio
exports.create = async (req, res) => {
    try {
        const { tenGio } = req.body;
        if (!tenGio) {
            return res.status(400).json({ message: "Tên giờ không được để trống" });
        }

        // 1. Kiểm tra xem tên giờ đã tồn tại chưa
        // .trim() để tránh trường hợp trùng do thừa khoảng trắng
        const existingGio = await ThoiGianGio.findOne({ 
            tenGio: { $regex: new RegExp(`^${tenGio.trim()}$`, 'i') } 
        });

        if (existingGio) {
            return res.status(409).json({ message: "Khung giờ này đã tồn tại trong hệ thống" });
        }

        // 2. Nếu chưa tồn tại thì tiến hành lưu
        const newGio = new ThoiGianGio({ tenGio: tenGio.trim() });
        const savedGio = await newGio.save();

        res.status(201).json({
            message: "Thêm mới thành công",
            data: savedGio
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// [GET] /api/thoi-gian-gio
exports.getAll = async (req, res) => {
    try {
        const listGio = await ThoiGianGio.find().sort({ createdAt: -1 });
        res.status(200).json({
            data: listGio
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// [GET] /api/thoi-gian-gio/:id
exports.getById = async (req, res) => {
    try {
        const gio = await ThoiGianGio.findById(req.params.id);
        if (!gio) {
            return res.status(404).json({ message: "Không tìm thấy dữ liệu" });
        }
        res.status(200).json({ data: gio });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// [PUT] /api/thoi-gian-gio/:id
exports.update = async (req, res) => {
    try {
        const { tenGio } = req.body;
        const { id } = req.params;

        if (!tenGio) {
            return res.status(400).json({ message: "Tên giờ không được để trống" });
        }

        // 1. Kiểm tra trùng: Tìm bản ghi có tenGio trùng nhưng _id khác id đang sửa
        const existingGio = await ThoiGianGio.findOne({ 
            tenGio: { $regex: new RegExp(`^${tenGio.trim()}$`, 'i') },
            _id: { $ne: id } 
        });

        if (existingGio) {
            return res.status(409).json({ message: "Khung giờ này đã tồn tại ở một bản ghi khác" });
        }

        // 2. Tiến hành cập nhật
        const updatedGio = await ThoiGianGio.findByIdAndUpdate(
            id,
            { tenGio: tenGio.trim() },
            { new: true }
        );

        if (!updatedGio) {
            return res.status(404).json({ message: "Không tìm thấy dữ liệu để cập nhật" });
        }

        res.status(200).json({
            message: "Cập nhật thành công",
            data: updatedGio
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// [DELETE] /api/thoi-gian-gio/:id
exports.deletee = async (req, res) => {
    try {
        const deletedGio = await ThoiGianGio.findByIdAndDelete(req.params.id);
        if (!deletedGio) {
            return res.status(404).json({ message: "Không tìm thấy dữ liệu để xóa" });
        }
        res.status(200).json({
            message: "Xóa thành công"
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};