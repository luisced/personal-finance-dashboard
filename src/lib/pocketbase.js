
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export const authUser = async (email, password) => {
  return await pb.collection('users').authWithPassword(email, password)
}

export const getTransactions = async (userId) => {
  return await pb.collection('transactions').getFullList({
    filter: