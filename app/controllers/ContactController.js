const { Contact } = require("../models/Contact")
const { Controller } = require("../helpers/Controller")

class ContactController {
  async createContact(req, res, next) {
    try {
      const { user, body } = req

      const contactConstruct = {
        name: body.name,
        addresses: [{ address: body.address, type: body.type }],
        user: user._id,
      }
      const contact = new Contact(contactConstruct)
      await contact.save()

      Controller.success(res, "New Contact added successfully", contact)
    } catch (e) {
      next(e)
    }
  }

  async getContacts(req, res, next) {
    try {
      const { user } = req
      const contacts = await Contact.find({ user: user._id })
      Controller.success(res, "Contacts successfully fetched", contacts)
    } catch (e) {
      next(e)
    }
  }

  async getContact(req, res, next) {
    try {
      const { user, params } = req
      const contact = await Contact.findOne({ user: user._id, _id: params.id })

      if (!contact) {
        throw new Error("Contact does not exist")
      }

      Controller.success(res, "Contact successfully fetched", contact)
    } catch (e) {
      next(e)
    }
  }

  async updateContact(req, res, next) {
    try {
      const { user, params, body } = req
      const contact = await Contact.findOne({ _id: params.id })

      if (!contact) {
        throw new Error("Contact does not exist")
      }
      if (user._id.toString() !== contact.user.toString()) {
        throw new Error("You do not have permission to update user")
      }

      await Contact.updateOne({ _id: contact._id }, { name: body.name, addresses: { address: body.address } })
      Controller.success(res, "Contact successfully updated", { _id: contact._id })
    } catch (e) {
      next(e)
    }
  }

  async deleteContact(req, res, next) {
    try {
      const { user, params } = req
      const contact = await Contact.findOne({ _id: params.id })

      if (!contact) {
        throw new Error("Contact does not exist")
      }
      if (user._id.toString() !== contact.user.toString()) {
        throw new Error("You do not have permission to delete user")
      }

      await Contact.deleteOne({ _id: contact._id })
      Controller.success(res, "Contact successfully deleted")
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new ContactController()
